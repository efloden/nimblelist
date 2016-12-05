import { Component, Input } from '@angular/core';
import { AppComponent } from './app.component';
import { Item }    from './item';

@Component({
  selector: 'item-form',
  templateUrl: 'item-form.component.html'
})
export class ItemFormComponent {

  model = new Item(1, 'Coffee', 6, true);

  submitted = false;

  @Input() items;

  onSubmit() {
    this.submitted = true
    this.items.pushItem(this.model);
  }

  newItem() {
    this.model = new Item(42, '', 42, true);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
