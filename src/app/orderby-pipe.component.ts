import { Pipe, PipeTransform } from "@angular/core";
import { Item } from './item';
@Pipe({ name: 'orderBy', pure: false })
export class OrderByPipe implements PipeTransform {
    transform(array: Item[], args: any): Item[] {
    array.sort((a, b) => {
      if (a.buying > b.buying) {
        return -1;
      //.completed because we want to sort the list by completed property
    } else if (a.buying < b.buying) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
