export const customFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const base = "http://localhost:4000";
    const full = url.startsWith("http") ? url : `${base}${url}`
    const res = await fetch(full,init);
    const data = await res.json();
    return res.ok ? data : Promise.reject(data);
};