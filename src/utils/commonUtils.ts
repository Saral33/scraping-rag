import axios from "axios";

class CommonUtils {

    static async isUrlValidAndExists(url: string): Promise<boolean> {
        try {
            new URL(url); // throws if invalid

            const response = await axios.head(url);

            return response.status >= 200 && response.status < 400;
        } catch (error) {
            return false;
        }
    }
}

export default CommonUtils