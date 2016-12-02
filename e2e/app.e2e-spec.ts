import { NimblelistPage } from './app.po';

describe('nimblelist App', function() {
  let page: NimblelistPage;

  beforeEach(() => {
    page = new NimblelistPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
