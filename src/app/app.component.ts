import { Component } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { OrderByPipe } from './orderby-pipe.component';
import { Item } from './item';
import { ITEMS } from './mocks';


@Component({
  selector: 'app-root',
  template: `
  <div class="list-page">
    <h1>
      {{title}}
    </h1>
    <div class="jumbotron">

        <div class="container">
        <h2> Add Groceries </h2>
          <form (ngSubmit)="onSubmit()" #itemForm="ngForm">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name"
                     required
                     [(ngModel)]="model.name" name="name"
                     #name="ngModel" >
            </div>
            <div class="form-group">
              <label for="cost">Cost</label>
              <input type="number" class="form-control" id="cost"
                     required
                     [(ngModel)]="model.cost" name="cost"
                     #cost="ngModel" >
            </div>
            <button type="submit" class="btn btn-default"
                (click)="onSubmit(); newItem(); itemForm.reset();"
                [disabled]="!itemForm.form.valid">
              Submit
            </button>
          </form>
        </div>
    </div>

    <ul class="list-group">
      <li class="list-group-item" *ngFor="let item of items | orderBy" style="padding:1px 3px;">
        <div style="display:inline-block">
        <p>{{item.name}} {{item.cost | currency:'USD':true}}</p>
        </div>
        <div *ngIf="item.buying" style="display:inline-block;float:right;padding:0">
          <span class="badge" (click)="boughtItem(item)">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Buying
          </span>
        </div>
        <div *ngIf="!item.buying" style="display:inline-block;float:right;padding:0">
          <span class="badge" (click)="buyingItem(item)">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Bought
          </span>
        </div>
      </li>
    </ul>
    <h3>Budget for shopping: <input type="text" style="width:30%" class="budget"[(ngModel)]="budget"></h3>
    <h3>Total cost: {{totalCost() | currency:'USD':true}}</h3>
    <h3>Remaining shopping budget: {{cashLeft() | currency:'USD':true}} </h3>
    <div class="progress">
      <div class="progress-bar" role="progressbar" [attr.aria-valuenow]="cashLeft()"
      aria-valuemin="0" [attr.aria-valuemax]="budget" [style.width]="(cashLeft() / budget * 100) + '%'">
        {{cashLeft() / budget * 100}} %
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NimbleList';
  budget = 100;
  items: Item[];

  constructor (private localStorageService: LocalStorageService) {}

  ngOnInit() {
      this.items = ITEMS;
      if (this.localStorageService.get('storedItems') != null) {
          this.items = this.localStorageService.get('storedItems') as Item[];
      }
      console.log(this.localStorageService.keys());
      console.log(this.localStorageService.get('storedItems'));
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

  boughtItem(item) {
    item.buying = false;
  }

  buyingItem(item) {
    item.buying = true;
  }

  pushItem(item) {
    this.items.push(item);
    this.localStorageService.set('storedItems', this.items);
  }

  removeItem(item) {
    var index = this.items.indexOf(item, 0);
    if (index > -1) {
        this.items.splice(index, 1);
    }
  }

  model = new Item(1, 'Coffee', 3.50, true);

  submitted = false;

  onSubmit() {
      this.submitted = true;
      this.pushItem(this.model);
  }

  newItem() {
    this.model = new Item(1, 'Coffee', 3.50, true);
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
