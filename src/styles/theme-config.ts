import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

export const MyCustomPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: "{green.50}",
			100: "{green.100}",
			200: "{green.200}",
			300: "{green.300}",
			400: "{green.400}",
			500: "{green.500}",
			600: "{green.600}",
			700: "{green.700}",
			800: "{green.800}",
			900: "{green.900}",
			950: "{green.950}",
		},

		colorScheme: {
			light: {
				surface: {
					0: "#ffffff",
					50: "{zinc.50}",
					100: "{zinc.100}",
					200: "{zinc.200}",
					300: "{zinc.300}",
					400: "{zinc.400}",
					500: "{zinc.500}",
					600: "{zinc.600}",
					700: "{zinc.700}",
					800: "{zinc.800}",
					900: "{zinc.900}",
					950: "{zinc.950}",
				},
			},
			/* dark: {
				surface: {
					0: "#ffffff",
					50: "{stone.50}",
					100: "{stone.100}",
					200: "{stone.200}",
					300: "{stone.300}",
					400: "{stone.400}",
					500: "{stone.500}",
					600: "{stone.600}",
					700: "{stone.700}",
					800: "{stone.800}",
					900: "{stone.900}",
					950: "{stone.950}",
				},
			}, */
		},
	},
});
