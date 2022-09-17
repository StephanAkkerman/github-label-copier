# GitHub Label Copier
This is a simple script Python for copying your favorite labels to another repository.\
[![Python 3.8](https://img.shields.io/badge/python-3.8-blue.svg)](https://www.python.org/downloads/release/python-380/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![MIT License](https://img.shields.io/github/license/StephanAkkerman/GitHub_Label_Copier.svg?color=brightgreen)](https://opensource.org/licenses/MIT)

---

## Setup
There are 3 thing that you need to know before running this script, those things are:
- Your GitHub token that allows the script to make changes to your repo ([Tutorial](https://catalyst.zoho.com/help/tutorials/githubbot/generate-access-token.html))
- The repo that you want to copy the labels from (this can be any public repo)
- Your repo that you want to copy the labels to

If you have Python installed then fill those 3 things in in `src/config.py` and then you are ready to run:
```
$ src/main.py
```

## .exe File
If you do not have Python installed, do not worry, I have compiled a .exe file. The file is the interactive version of this script, if you want to look at the source code then check `src/label_copier.py`.
However, if you are afraid of running .exe files, you can built it yourself using the pyinstaller module. The instructions to do so are posted below.
```
$ pip install pyinstaller
$ pyinstaller --onefile src/label_copier.py
```
The .exe file will be created in the following location `src/dist/label_copier.exe`.

## Dependencies
There are no dependencies, the only library this script uses is the default request library for Python.

## How to run
- Clone the repository.
- Get your token
- Run `$ src/main.py` or `label_copier.exe`
- See results.
