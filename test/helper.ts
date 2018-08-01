import test from 'ava'
import axios, { AxiosInstance } from 'axios';
import { ApplicationLoader, SettingOptions } from '../src'

declare module 'axios' {
    interface AxiosInstance {
        options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    }
}

const settings: SettingOptions = {port: '0'};

export const helper = {
    getAxios: () => axios as AxiosInstance,
    isExpress: () => process.env.SERVER === 'express',
    isFastify: () => process.env.SERVER === 'fastify',
    setBootOptions: (opts: {lazyInit: boolean}) => {
        settings.lazyInit = opts.lazyInit
    }
};


let nodeServer;

test.before(async t => {
    nodeServer = await new ApplicationLoader(process.env.SERVER || '', settings).start();

    helper.getAxios = () => {
        return axios.create({
            baseURL: `http://localhost:${nodeServer.address().port}`
        });
    };
});

test.after.always(t => {
    return new Promise((resolve, reject) => {
        if (!nodeServer) {
            reject('no running server');
            return;
        }
        nodeServer.close((err) => {
            if (err) reject(err);
            resolve();
        });
    });
});


