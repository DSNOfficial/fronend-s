import dayjs from "dayjs";

export const khmerLocale = {
    name: 'km',
    weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    weekdaysShort: 'អា_ច_អ_ពុ_ព្រ_សុ_សៅ'.split('_'),
    weekdaysMin: 'អា_ច_អ_ពុ_ព្រ_សុ_សៅ'.split('_'),
    months: 'មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    monthsShort: 'មក_កុ_មិនា_មេ_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    weekStart: 1,
    formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    relativeTime: {
        future: 'ក្នុង %s',
        past: '%s មុន',
        s: 'ប៉ុន្មានវិនាទី',
        m: 'មួយនាទី',
        mm: '%d នាទី',
        h: 'មួយម៉ោង',
        hh: '%d ម៉ោង',
        d: 'មួយថ្ងៃ',
        dd: '%d ថ្ងៃ',
        M: 'មួយខែ',
        MM: '%d ខែ',
        y: 'មួយឆ្នាំ',
        yy: '%d ឆ្នាំ'
    },
    ordinal: n => `${n}`
};

dayjs.locale(khmerLocale, null, true);


export const formatDateClient = (date) => {
    if (date !== null && date !== "") {
        return dayjs(date).format("DD/MM/YYYY")
    }
    return null;
}

export const formatDateServer = (date) => {
    if (date !== null && date !== "") {
        return dayjs(date).format("YYYY-MM-DD")
    }
    return null;
}

export const Config = {

    base_url :"http://localhost:1090/api/",
    image_path :"http://localhost:81/project/tsnh/public_file/images/",
   // image_path:"",
    version: "",
    token: ""
}
export const isEmptyOrNull = (value) => {
    if (value === "" || value === null || value === undefined || value === "null" || value === "undefined") {
        return true;
    }
    return false;
}

export const setUser = (user = {}) => {
    localStorage.setItem("profile", JSON.stringify(user))
    localStorage.setItem("isLogin", "1")
}

export const getUser = () => {
    var user = localStorage.getItem("profile")
    if (user != null && user != "") {
        user = JSON.parse(user);
        return user;
    }
    return null;
}

export const setRoleMenu = (permission_menu = {}) => {
    localStorage.setItem("permission_menu", JSON.stringify(permission_menu))
    localStorage.setItem("isLogin", "1")
}

export const getRoleMenu = () => {
    var permission_menu = localStorage.getItem("permission_menu")
    if (!isEmptyOrNull(permission_menu)) {
        return JSON.parse(permission_menu);
    }
    return null;
    // if( permission_menu != null && permission_menu != ""){
    //     permission_menu  = JSON.parse(permission_menu);
    //     return permission_menu;
    // } 
    // return null;
};

export const logout = (user = {}) => {
    localStorage.setItem("profile", "")
    localStorage.setItem("isLogin", "0")
    window.location.href = "/admin/login"

};
export const isLogin = () => {
    var user = isLogin
    if (localStorage.getItem("isLogin") == "1") {
        return true
    } else {
        return false
    }
};

export const setAccessToken = (access_token) => {
    localStorage.setItem("access_token", access_token)
    // const access_token = JSON.parse(localStorage.getItem('access_token'));
};

export const getAccessToken = () => {
    localStorage.getItem("access_token")
};

export const setRefreshToken = (refresh_token) => {
    localStorage.setItem("refresh_token", refresh_token)
};

export const getRefreshToken = () => {
    localStorage.getItem("refresh_token")
};


export const generateUniqueCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
