import { createClient } from "@supabase/supabase-js";
import { storageConfig } from "../../config/storage.config";

const supabase = createClient(storageConfig.STORAGE_URL, storageConfig.STORAGE_API_KEY);

export default class SupabaseStorage {

    static async uploadFile(file : File, fileName : string) {
        const { data, error } = await supabase
            .storage
            .from(storageConfig.STORAGE_BUCKET)
            .upload(fileName, file, {
                upsert : true
            })
        if(error) {
            throw error;
        }
        return data.path
    }

    static async generateUploadSignedUrl(path : string) {
        const { data, error } = await supabase
            .storage
            .from(storageConfig.STORAGE_BUCKET)
            .createSignedUploadUrl(path);
        if(error) {
            throw error;
        }
        return data.token;
    }

    static async generateSignedUrl(path : string, expiresIn : number = 60) : Promise<string> {
        const { data, error } = await supabase
            .storage
            .from(storageConfig.STORAGE_BUCKET)
            .createSignedUrl(path, expiresIn);
        if(error) {
            throw error;
        }
        return data.signedUrl;
    }

    static async deleteFile(path : string) : Promise<void> {
        const { data, error } = await supabase
            .storage
            .from(storageConfig.STORAGE_BUCKET)
            .remove([path]);
        if(error) {
            throw error;
        }
        return;
    }

}