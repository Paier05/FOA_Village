import { useOG } from "./ogContext.js";

export const useOptionalOG = () => {
    try 
    {
        return useOG();
    } catch (e) 
    {
        return {};
    }
};