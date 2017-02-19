
export class ViewAndModel {

    constructor(public viewName: string, public model?: any) {
        this.viewName = viewName;
        this.model = model;
    }
}