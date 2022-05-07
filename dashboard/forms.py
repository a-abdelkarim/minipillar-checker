from django import forms

class MinipillarFileForm(forms.Form):
    mp_file = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )