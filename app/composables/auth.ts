import type { User } from "lucia";
import config from "../config.json"

export const useUser = () => {
    const user = useState<User | null>("user", () => null);
    return user;
};

export const useAuthenticatedUser = () => {
    const user = useUser();
    return computed(() => {
        const userValue = unref(user);
        if (!userValue) {
            throw createError("userAuthenticatedUser() can only be used in protected pages");
        }
        return userValue;
    });
};

export const useLogout = () => {
    return navigateTo(`https://ueelife.auth0.com/v2/logout?client_id=${config.auth0.client_id}&returnTo=${config.public.app_domain}/auth/logout`, {
        external: true
    })
}