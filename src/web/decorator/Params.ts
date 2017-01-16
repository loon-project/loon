export interface IParamOptions {

    required?: boolean

    parseJson?: boolean

}

export function Param(name: string) {
    return () => {
        return
    }
}

export function Session(objectName?: string) {
    return () => {
        return
    }
}

export function QueryParam(name: string, options?: IParamOptions) {
    return () => {
        return
    }
}

export function HeaderParam(name: string, options?: IParamOptions) {
    return () => {
        return
    }
}

export function CookieParam(name: string, options?: IParamOptions) {
    return () => {
        return
    }
}

export function Body(options?: IParamOptions) {
    return () => {
        return
    }
}

export function BodyParam(name: string, options?: IParamOptions) {
    return () => {
        return
    }
}

