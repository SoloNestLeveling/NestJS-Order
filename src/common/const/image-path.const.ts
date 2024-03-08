import { join } from "path";

export const PROJECT_ROOT_PATH = process.cwd();
export const PUBLIC_FOLDER_NAME = 'public';
export const TEMP_FOLDER_NAME = 'temp';
export const USER_FOLDER_NAME = 'user';
export const MENU_FOLDER_NAME = 'menu';
export const REVIEW_FOLDER_NAME = 'review';



//절대경로
export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH,
    PUBLIC_FOLDER_NAME,
);

export const TEMP_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    TEMP_FOLDER_NAME,
);

export const USER_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    USER_FOLDER_NAME,
);


export const MENU_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    MENU_FOLDER_NAME,
);

export const REVIEW_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    REVIEW_FOLDER_NAME,
);



//상대경로

export const USER_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    USER_FOLDER_NAME
);

export const MENU_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    MENU_FOLDER_NAME,
);

export const REVIEW_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    REVIEW_FOLDER_NAME,
);
