# GitHub Label Copier

[![Python 3.8](https://img.shields.io/badge/python-3.8-blue.svg)](https://www.python.org/downloads/release/python-380/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![MIT License](https://img.shields.io/github/license/StephanAkkerman/GitHub_Label_Copier.svg?color=brightgreen)](https://opensource.org/licenses/MIT)

This repository contains two simple tools to match easily match your labels with your other GitHub repositories.

## GitHub Workflow

There are two options for copying over the labels from another repository. The first is to keep the labels that are already in the repository and only add the labels that are not in the repository yet. The second option is to delete all the labels in the repository and then add the labels from the other repository.

For both options, you need to give the workflow write access to the repository. You can find these settings in the repository settings under the `Actions` tab. Or fill in this URL: `https://github.com/[GITHUB-USERNAME]/[GITHUB-REPO]/settings/actions`, replace `[GITHUB-USERNAME]` with your GitHub username and `[GITHUB-REPO]` with the repository name.

In the yml file, you need to fill in the following `const sourceRepo = 'GITHUB-USER/GITHUB-REPO';`, replace `GITHUB-USER` with the username of the repository you want to copy the labels from and `GITHUB-REPO` with the repository name.

### Option 1: Keep Labels

This option will keep all the labels that are already in the repository and only add the labels that are not in the repository yet. This is useful if you want to keep the labels that you have already created in the repository.

You can find the .yml file for this workflow in the following location `workflows/keep-labels.yml`. Simply copy the contents of this file to your `.github/workflows` folder in your repository.

### Option 2: Delete Labels

This option will delete all the labels in the repository and then add the labels from the other repository. This is useful if you want to have the same labels in all your repositories.

You can find the .yml file for this workflow in the following location `workflows/delete-labels.yml`. Simply copy the contents of this file to your `.github/workflows` folder in your repository.

## Python Script

### Setup

There are 3 thing that you need to know before running this script, those things are:

- Your GitHub token that allows the script to make changes to your repo ([Tutorial](https://catalyst.zoho.com/help/tutorials/githubbot/generate-access-token.html))
- The repo that you want to copy the labels from (this can be any public repo)
- Your repo that you want to copy the labels to

If you have Python installed then fill those 3 things in in `src/config.py` and then you are ready to run:

```bash
python src/main.py
```

### .exe File

If you do not have Python installed, do not worry, I have compiled a .exe file. The file is the interactive version of this script, if you want to look at the source code then check `src/label_copier.py`.
However, if you are afraid of running .exe files, you can build it yourself using the pyinstaller module. The instructions to do so are posted below.

```bash
pip install pyinstaller
pyinstaller --onefile src/label_copier.py
```

The .exe file will be created in the following location `src/dist/label_copier.exe`.

### Dependencies

There are no dependencies, the only library this script uses is the default request library for Python.

### How to run

- Clone the repository.
- Get your GitHub token.
- Run `python src/main.py` or `label_copier.exe`.
- See results.
