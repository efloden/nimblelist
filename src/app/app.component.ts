import { Component } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { OrderByPipe } from './orderby-pipe.component';
import { Item } from './item';
import { ITEMS } from './mocks';
import { AngularFire, AuthProviders, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  template: `
  <!-- Splash screen -->
  <section [ngSwitch]="isAuth">
    <md-card id="page-splash"  *ngSwitchCase="false">
      <h3 class="logo">{{title}}</h3>
      <div>
        <button id="sign-in-button" (click)="login()" class="mdl-button--raised mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons">account_circle</i> Sign in with Google</button>
      </div>
    </md-card>
  <div class="list-page" *ngSwitchCase="true">
      <button id="sign-out-button" class="mdl-button--raised mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons">account_circle</i> Sign out</button>
      <div class="mdl-layout__header-row titlebar">
        <h3 class="logo">{{title}}</h3>
      </div>
    <!-- Navigation Bar -->
    <div class="tab mdl-layout__header-row mdl-color--light-blue-600">
      <div class="mdl-tab">
        <div id="menu-recent" class="mdl-layout__tab is-active mdl-button mdl-js-button mdl-js-ripple-effect">
          <i class="material-icons">new_releases</i> Coles
        </div>
        <div id="menu-my-posts" class="mdl-layout__tab mdl-button mdl-js-button mdl-js-ripple-effect">
          <i class="material-icons">home</i> Woolworths
        </div>
        <div id="menu-my-top-posts" class="mdl-layout__tab mdl-button mdl-js-button mdl-js-ripple-effect">
          <i class="material-icons">trending_up</i> Fuji
        </div>
        <button (click)="addButton()" class="mdl-button mdl-js-button mdl-button--fab mdl-color--amber-400 mdl-shadow--4dp mdl-js-ripple-effect" id="add">
          <i class="material-icons">mode_edit</i>
        </button>
      </div>
    </div>
    <div class="jumbotron" id="addGrocery" style="display:none">
        <div class="container">
        <h3> Add Groceries </h3>
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
      <li class="list-group-item" *ngFor="let item of fireItems | async">
        <button type="button" class="btn btn-danger btn-xs" (click)="removeItem(item)">
          <span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-"></span>
        </button>
         {{item.name}} {{item.cost | currency:'USD':true}}
         <div *ngIf="item.buying" style="display:inline-block;float:right;padding:0">
           <button class="btn btn-primary btn-xs" (click)="boughtItem(item)">
             Buying
           </button>
         </div>
         <div *ngIf="!item.buying" style="display:inline-block;float:right;padding:0">
           <button class="btn btn-success btn-xs" (click)="buyingItem(item)">
               <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Bought
           </button>
         </div>
      </li>
    </ul>

    <ul class="list-group">
      <li class="list-group-item" *ngFor="let item of items | orderBy" style="padding:1px 3px;">
        <div style="display:inline-block">
        <p>
        <button type="button" class="btn btn-danger btn-xs" (click)="removeItem(item)">
          <span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-"></span>
        </button>
          {{item.name}} {{item.cost | currency:'USD':true}}
        </p>
        </div>
        <div *ngIf="item.buying" style="display:inline-block;float:right;padding:0">
          <button class="btn btn-primary btn-xs" (click)="boughtItem(item)">
            Buying
          </button>
        </div>
        <div *ngIf="!item.buying" style="display:inline-block;float:right;padding:0">
          <button class="btn btn-success btn-xs" (click)="buyingItem(item)">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Bought
          </button>
        </div>
      </li>
    </ul>
    <p>Budget for shopping: <input type="text" style="width:30%" class="budget"[(ngModel)]="budget"></p>
    <p>Total cost: {{totalCost() | currency:'USD':true}}</p>
    <p>Remaining shopping budget: {{cashLeft() | currency:'USD':true}} </p>
    <div class="progress">
      <div class="progress-bar" role="progressbar" [attr.aria-valuenow]="cashLeft()"
      aria-valuemin="0" [attr.aria-valuemax]="budget" [style.width]="(cashLeft() / budget * 100) + '%'">
        {{cashLeft() / budget * 100}} %
      </div>
    </div>
  </div>
  </section>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NimbleList';
  budget = 100;
  items: Item[];
  fireItems: FirebaseListObservable<Item[]>;
  user = {};
  isAuth = false;
  constructor (private localStorageService: LocalStorageService, public af: AngularFire) {
    this.af.auth.subscribe(user => {
      if(user) {
        // user logged in
        this.isAuth = true;
        this.user = user;
      }
      else {
        // user not logged in
        this.isAuth = false;
        this.user = {};
      }
    });
    this.fireItems = af.database.list('/itemData');
    console.log(this.fireItems);
  }

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
  login() {
    this.af.auth.login({
      provider: AuthProviders.Google
    });
  }

  logout() {
    this.af.auth.logout();
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

  // FIREBASE FUNCTIONS
  addButton() {
    var display = document.getElementById('addGrocery').style.display;
    console.log(display);
    if (display == 'none') {
        document.getElementById('addGrocery').style.display = 'block';
    } else {
        document.getElementById('addGrocery').style.display = 'none';
    }
  }
  get diagnostic() { return JSON.stringify(this.model);

  }
}
