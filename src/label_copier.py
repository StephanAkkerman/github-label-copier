import requests

def interactive():
    
    token = input('Paste your GitHub token with access to writing to your repo:\n')
    copy_from = input('Enter the user + repo that you want to copy the labels from (for instance: StephanAkkerman/GitHub_Label_Copier):\n')
    copy_to = input('Enter the user + repo that you want to copy the labels to (for instance: StephanAkkerman/TensorTrade):\n')
    delete_old_labels = input('Do you want to delete all old labels from the target repo? (y/n):\n')
    
    # https://docs.github.com/en/rest/reference/issues#get-a-label    
    copy_from_labels = requests.get('https://api.github.com/repos/'+copy_from+'/labels').json()
    copy_to_labels = requests.get('https://api.github.com/repos/'+copy_to+'/labels').json()
    
    if delete_old_labels.lower() == 'y':
        for label in copy_to_labels:
            requests.delete('https://api.github.com/repos/'+copy_to+'/labels/'+label['name'], headers={'Authorization': 'token %s' % token})
            print(f"Deleted {label['name']}")
            
    for label in copy_from_labels:
        requests.post('https://api.github.com/repos/'+copy_to+'/labels', headers={'Authorization': 'token %s' % token}, json={'name': label['name'], 'color': label['color'], 'description': label['description']})
        print(f"Copied {label['name']}")

    print("Done!")
    
if __name__ == '__main__':
    interactive()