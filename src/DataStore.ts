export default class UIDataStore<T> {
  private _data: T | null = null;
  private id: number;
  private static instances = 0;

  constructor(saveBtn: HTMLButtonElement, discardBtn: HTMLButtonElement) {
    this.id = ++UIDataStore.instances;
    this.enableStorageButtons(saveBtn, discardBtn);
  }

  public set data(data: T | null) {
    this._data = data;
  }

  public get data(): T | null {
    const jsonData = localStorage.getItem(`data${this.id}`);
    return jsonData ? JSON.parse(jsonData) : null;
  }

  private enableStorageButtons(
    saveBtn: HTMLButtonElement,
    discardBtn: HTMLButtonElement
  ) {
    saveBtn.addEventListener("click", () => {
      this.save();
    });

    discardBtn.addEventListener("click", () => {
      this.discard();
    });
  }

  private save() {
    if (!this._data) return;
    localStorage.setItem(`data${this.id}`, JSON.stringify(this._data));
  }

  private discard() {
    localStorage.removeItem(`data${this.id}`);
  }
}
