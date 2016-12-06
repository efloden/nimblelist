import { Component} from '@angular/core';
import { AppComponent } from './app.component';
import { Item }    from './item';

@Component({
  selector: 'item-form',
  templateUrl: 'item-form.component.html'
})
export class ItemFormComponent {

  model = new Item(1, 'Coffee', 6, true);

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
