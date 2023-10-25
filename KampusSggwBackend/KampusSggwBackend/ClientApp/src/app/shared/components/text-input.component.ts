import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  styleUrls: ['./text-input.component.scss'],
  templateUrl: './text-input.component.html'
})
export class TextInput implements OnChanges {
  @Input() public text: string = '';
  @Input() public control: FormControl = new FormControl('');
  @Input() public isDisabled: string = 'false';
  @Input() public multiline: boolean = false;
  @Input() public multilineRowsCount: number = 3;

  // Validation messages
  @Input() public requiredErrorMessage: string | undefined;

  public attrDisabledValue : string | null = null;

  constructor() { }

  public ngOnChanges(): void {
    if (this.isDisabled == 'true')
    {
      this.attrDisabledValue = 'disabled';
    }
    else if (this.isDisabled == 'false')
    {
      this.attrDisabledValue = null;
    }
    else
    {
      this.attrDisabledValue = null;
    }
  }
}
