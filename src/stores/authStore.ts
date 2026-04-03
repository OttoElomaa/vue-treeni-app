import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase-client";
import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
	const user = ref(null as unknown as User);

	const email = import.meta.env.VITE_DEV_LOGIN_EMAIL;
	const pw = import.meta.env.VITE_DEV_LOGIN_PASSWORD;

	async function devLogin() {
		// Hardcoded for dev phase - move these to .env later!
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: pw,
		});

		if (data.user) user.value = data.user;
		if (error) console.error("Login failed:", error.message);
	}

	return { user, devLogin };
});
