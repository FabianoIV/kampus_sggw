import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from './pipes/enum-keys.pipe';

import { TextInput } from './components/text-input.component';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NgbModule,
];

const PIPES = [
  EnumKeysPipe, // Pipe for iterating over enums
];

const COMPONENTS = [
  TextInput,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...COMPONENTS,
    ...PIPES,
    ...MODULES
  ],
})
export class SharedModule {
}
