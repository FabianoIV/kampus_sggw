import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class EnumKeysPipe implements PipeTransform {
  transform(value: { [x: string]: any; }, args: string[]): Array<any> {
    const keys = [];
    for (const enumMember in value) {
      if (enumMember) {
        keys.push({ key: enumMember, value: value[enumMember] });
      }
    }
    return keys;
  }
}
