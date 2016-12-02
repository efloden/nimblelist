import { Component } from '@angular/core';
import { Item } from './item';
import { ITEMS } from './mocks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NimbleList : Groceries';
  budget = 100;
  items: Item[];

  ngOnInit() {
      this.items = ITEMS;
  }

  totalCost() {
    let sum = 0;
    for (let item of this.items) {
      if (item.buying) sum += item.cost;
    }
    return sum;
  }

  cashLeft() {
    return this.budget - this.totalCost();
  }
}
