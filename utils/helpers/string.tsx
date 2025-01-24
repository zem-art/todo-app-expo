export default function convertToHyphen(str:string) {
    return str.trim().toLowerCase().replace(/\s+/g, '-');
}