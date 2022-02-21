from copy import copy
import requests
import config


def main():

    # https://docs.github.com/en/rest/reference/issues#get-a-label
    copy_from_labels = requests.get(
        "https://api.github.com/repos/" + config.copy_from + "/labels"
    ).json()
    copy_to_labels = requests.get(
        "https://api.github.com/repos/" + config.copy_to + "/labels"
    ).json()
    
    updated_labels = []
    
    # https://docs.github.com/en/rest/reference/issues#update-a-label
    for label_from in copy_from_labels:
        for label_to in copy_to_labels:
            # If the label title is the same, overwrite it
            if label_from['name'] == label_to['name']:             
                print(f"Updated {label_to['name']}")
                requests.patch(
                    "https://api.github.com/repos/"
                    + config.copy_to
                    + "/labels/"
                    + label_to["name"],
                    headers={"Authorization": "token %s" % config.token},
                    json={
                        "new_name": label_from["name"],
                        "color": label_from["color"],
                        "description": label_from["description"],
                    },
                    )                
                updated_labels.append(label_from['name'])
                    
    # https://docs.github.com/en/rest/reference/issues#delete-a-label
    if config.delete_old_labels:
        for label in copy_to_labels:
            if label['name'] not in updated_labels:
                print(f"Deleted {label['name']}")
                requests.delete(
                    "https://api.github.com/repos/"
                    + config.copy_to
                    + "/labels/"
                    + label["name"],
                    headers={"Authorization": "token %s" % config.token},
                )

    # https://docs.github.com/en/rest/reference/issues#create-a-label
    for label in copy_from_labels:
        if label['name']  not in updated_labels:
            print(f"Copied {label['name']}")
            requests.post(
                "https://api.github.com/repos/" + config.copy_to + "/labels",
                headers={"Authorization": "token %s" % config.token},
                json={
                    "name": label["name"],
                    "color": label["color"],
                    "description": label["description"],
                },
            )

    print("Done!")


if __name__ == "__main__":

    main()
