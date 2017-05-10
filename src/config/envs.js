const envs = {
    product: {
        envName: 'product',
        api_url: {
            doctor: 'https://services.mingyizhudao.com/doctor',
            login: 'https://login.mingyizhudao.com'
        },
        static: {
            login: 'https://app.mingyizhudao.com/login',
            doctor: 'https://app.mingyizhudao.com/doctor',
            agreement: 'https://app.mingyizhudao.com/agreement'
        }
    },
    alpha: {
        envName: 'alpha',
        api_url: {
            doctor: 'https://services.alpha.mingyizhudao.com/doctor',
            login: 'https://login.alpha.mingyizhudao.com'
        },
        static: {
            login: 'https://app.alpha.mingyizhudao.com/login',
            doctor: 'https://app.alpha.mingyizhudao.com/doctor',
            agreement: 'https://app.mingyizhudao.com/agreement'
        }
    },
    test: {
        envName: 'test',
        api_url: {
            doctor: 'http://services.dev.mingyizhudao.com/doctor',
            login: 'http://login.dev.mingyizhudao.com'
        },
        static: {
            login: '//app.dev.mingyizhudao.com/login',
            doctor: 'http://app.dev.mingyizhudao.com/doctor',
            agreement: 'https://app.mingyizhudao.com/agreement'
        }
    },
    dev: {
        envName: 'dev',
        api_url: {
            doctor: 'http://services.dev.mingyizhudao.com/doctor',
            login: 'http://login.dev.mingyizhudao.com'
        },
        static: {
            login: '//app.dev.mingyizhudao.com/login',
            doctor: 'http://app.dev.mingyizhudao.com/doctor',
            agreement: 'https://app.mingyizhudao.com/agreement'
        }
    }
};
let env;
if (__DEV__) {
    env = envs.dev;
}
if (__ALPHA__) {
    env = envs.alpha;
}
if (__TEST__) {
    env = envs.test;
}
if (__PROD__) {
    env = envs.product;
}
window.envs = envs;
window.env = env;
export default env;