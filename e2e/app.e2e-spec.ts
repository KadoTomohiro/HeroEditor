import { HeroEditorPage } from './app.po';

describe('hero-editor App', () => {
  let page: HeroEditorPage;

  beforeEach(() => {
    page = new HeroEditorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
