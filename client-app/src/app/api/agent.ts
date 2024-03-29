import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "http";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity, ActivityFormValues } from "../models/activity";
import { PaginatedResult } from "../models/pagination";
import { Photo, Profile } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    console.log('Checking token');

    if (token) {
        config!.headers!.Authorization = `Bearer ${token}`;
        console.log('Token set ' + token);
    }

    return config;
});

axios.interceptors.response.use(async response => {

    if (process.env.NODE_ENV === 'development')
        await sleep(1000);
    
        const pagination = response.headers['pagination'];

    if (pagination) {
        var anyResponse = response as AxiosResponse<PaginatedResult<any>>; 
        anyResponse.data = new PaginatedResult<any>(response.data, JSON.parse(pagination));
        return anyResponse;
    }

    return response;
    
}, (error: AxiosError<any>) => {
    const { data, status, config, headers } = error.response!;
    switch (status) {
        case 400:
            if (typeof(data) === 'string')
            {
                toast.error(data);
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for(const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            if (headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')) {
                store.userStore.logout();
                toast.error('Session expired - please log in again');
            } else {
                toast.error('unauthorised');
            }
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }

    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<{}, AxiosResponse<T>>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<{}, AxiosResponse<T>>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>("/activities", { params }).then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
    refreshToken: () => requests.post<User>('/account/refreshToken', {}),
    verifyEmail: (token: string, email: string) => requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`, {}),
    resendEmail: (email: string) => requests.get(`/account/resendEmail?email=${email}`)
}

const Profiles = {
    get: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<FormData, AxiosResponse<Photo>>('photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
    deletePhoto: (id:string) => requests.delete(`/photos/${id}`),
    updateFollowing: (userName: string) => requests.post(`/follow/${userName}`, {}),
    listFollowings: (userName: string, predicate: string) => requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent