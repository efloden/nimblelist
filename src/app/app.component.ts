import { Component } from '@angular/core';
import { ItemFormComponent } from './item-form.component';
import { Item } from './item';
import { ITEMS } from './mocks';


@Component({
  selector: 'app-root',
  template: `
  <div class="list-page">
    <h1>
      {{title}}
    </h1>
    <item-form></item-form>
    <ul>
      <li *ngFor="let item of items">
        <h2>{{item.name}} {{item.cost | currency:'USD':true}}</h2>
        <div *ngIf="item.buying">
          <button class="button-cancel" (click)="cancelItem(item)"  >X</button>
        </div>
        <div *ngIf="!item.buying">
          <button class="button-cancel" (click)="addItem(item)"  >X</button>
        </div>
      </li>
    </ul>
    <h3>Budget for shopping: <input type="text" style="width:30%" class="budget"[(ngModel)]="budget"></h3>
    <h3>Remaining shopping budget: {{cashLeft() | currency:'USD':true}} </h3>
    <h3>Total cost: {{totalCost() | currency:'USD':true}}</h3>
  </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NimbleList';
  budget = 100;
  items: Item[];

  ngOnInit() {
      this.items = ITEMS;
      var mock: Item = new Item(1, "Coffee", 3, true);
      this.pushItem(mock);
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

  cancelItem(item) {
    item.buying = false;
  }

  addItem(item) {
    item.buying = true;
  }

  pushItem(item) {
    this.items.push(item);
  }

}
