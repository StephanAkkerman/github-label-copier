import requests
import config

def main():
        
    # https://docs.github.com/en/rest/reference/issues#get-a-label    
    copy_from_labels = requests.get('https://api.github.com/repos/'+config.copy_from+'/labels').json()
    copy_to_labels = requests.get('https://api.github.com/repos/'+config.copy_to+'/labels').json()
        
    # https://docs.github.com/en/rest/reference/issues#delete-a-label
    for label in copy_to_labels:
        print(f"Deleted {label['name']}")
        requests.delete('https://api.github.com/repos/'+config.copy_to+'/labels/'+label['name'], headers={'Authorization': 'token %s' % config.token})
        
    #https://docs.github.com/en/rest/reference/issues#create-a-label
    for label in copy_from_labels:
        print(f"Copied {label['name']}")
        requests.post('https://api.github.com/repos/'+config.copy_to+'/labels', headers={'Authorization': 'token %s' % config.token}, json={'name': label['name'], 'color': label['color'], 'description': label['description']})

    print("Done!")

if __name__ == '__main__':

    main()