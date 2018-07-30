import test from 'ava'
import axios, { AxiosInstance } from 'axios';
import { ApplicationLoader } from '../src'

declare module 'axios' {
    interface AxiosInstance {
        options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    }
}


type HelperFields = {
    getAxios: () => AxiosInstance;
    isExpress: () => boolean;
    isFastify: () => boolean;
};

export const helper: HelperFields = {
    getAxios: () => axios,
    isExpress: () => process.env.SERVER === 'express',
    isFastify: () => process.env.SERVER === 'fastify'
};


let nodeServer;

test.before(async t => {
    nodeServer = await new ApplicationLoader(process.env.SERVER || '', {port: '0'}).start();

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


