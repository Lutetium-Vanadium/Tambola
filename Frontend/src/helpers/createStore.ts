type Type = "array" | "boolean" | "number" | "object" | "string";

export interface DefaultValue {
  value?: any;
  type: Type;
}

export interface Defaults {
  [key: string]: DefaultValue;
}

export interface Types {
  [key: string]: Type;
}

class Store {
  private _types: Types = {};
  private _data: obj = {};

  constructor(defaults: Defaults) {
    Object.entries(defaults).forEach(([key, value]) => {
      this._types[key] = value.type;
      let data = value.value;

      if (data === undefined) {
        switch (value.type) {
          case "array":
            data = [];
            break;
          case "boolean":
            data = false;
            break;
          case "number":
            data = 0;
            break;
          case "object":
            data = {};
            break;
          case "string":
          default:
            data = "";
            break;
        }
      }
      this._data[key] = data;
    });

    this.setDefaults();
  }

  get = (key: string) => {
    const value = localStorage.getItem(key) ?? "";

    switch (this._types[key]) {
      case "array":
      case "object":
        return JSON.parse(value);
      case "boolean":
        return value === "true";
      case "number":
        return +value;
      case "string":
      default:
        return value;
    }
  };

  getAll = () => {
    let data: obj = {};

    Object.keys(localStorage).forEach((key) => {
      data[key] = this.get(key);
    });

    return data;
  };

  set = (key: string, val: any) => {
    localStorage.setItem(key, val);
  };

  setAll = (obj: obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      this.set(key, value);
    });
  };

  private setDefaults = () => {
    try {
      for (const key in this._data) {
        const value = localStorage.getItem(key);
        if (value === null) {
          localStorage.setItem(key, this._data[key]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
}

const createStore = (defaults: Defaults = {}) => new Store(defaults);

export default createStore;
