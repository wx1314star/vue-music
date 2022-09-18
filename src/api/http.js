import axios from "axios";

//单位毫秒
axios.defaults.timeout = 5000;
//允许跨域
axios.defaults.withCredentials = true;

//响应头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

//基础url
axios.defaults.baseURL = "http://localhost:8888";

//响应拦截器
axios.interceptors.response.use(
  response => {
    //如果response的status是200,成功
    if (response.status == 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        //no login
        case 401:
          router.replace({
            path: "/",
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;
        //page not find
        case 404:
          break;
      }
      return Promise.reject(error.response);
    }
  }
);

/*封装get方法 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/*封装post方法 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/*封装put方法 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/*封装delete方法 */
export function del(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
