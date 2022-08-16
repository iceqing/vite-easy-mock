declare const config: {
    dir: string;
    pattern: string;
    fileSuffix: boolean;
    delay: number[];
};
export declare type MockConfig = {
    dir?: string;
    pattern?: string;
    delay?: [number, number];
};
export default config;
