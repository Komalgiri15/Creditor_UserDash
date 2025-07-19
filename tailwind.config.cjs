/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: "hsl(var(--gold))",
        silver: "hsl(var(--silver))",
        bronze: "hsl(var(--bronze))",
        reader: {
          background: "hsl(0, 0%, 99%)",
          text: "hsl(0, 0%, 10%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" }
        },
        "spotlight": {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "0.8", transform: "translate(-50%,-40%) scale(1)" }
        },
        "gradient-shift": {
          "0%": { 
            backgroundPosition: "0% 50%",
            opacity: "0.7"
          },
          "50%": {
            opacity: "0.9"
          },
          "100%": { 
            backgroundPosition: "100% 50%",
            opacity: "0.7"
          }
        },
        "float": {
          "0%": {
            transform: "translateY(0px)"
          },
          "50%": {
            transform: "translateY(-3px)"
          },
          "100%": {
            transform: "translateY(0px)"
          }
        },
        "pulse-subtle": {
          "0%": {
            boxShadow: "0 0 0 0 rgba(var(--primary-rgb), 0.2)"
          },
          "70%": {
            boxShadow: "0 0 0 6px rgba(var(--primary-rgb), 0)"
          },
          "100%": {
            boxShadow: "0 0 0 0 rgba(var(--primary-rgb), 0)"
          }
        },
        "ripple": {
          "0%": { 
            transform: "scale(0.8)",
            opacity: "1"
          },
          "100%": { 
            transform: "scale(2)",
            opacity: "0"
          }
        },
        "bounce-subtle": {
          "0%, 100%": { 
            transform: "translateY(0)"
          },
          "50%": { 
            transform: "translateY(-4px)"
          }
        },
        "glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px 2px rgba(var(--primary-rgb), 0.3)"
          },
          "50%": { 
            boxShadow: "0 0 20px 5px rgba(var(--primary-rgb), 0.5)"
          }
        },
        "rotate-slow": {
          "0%": { 
            transform: "rotate(0deg)"
          },
          "100%": { 
            transform: "rotate(360deg)"
          }
        },
        "wiggle": {
          "0%, 100%": { 
            transform: "rotate(-3deg)"
          },
          "50%": { 
            transform: "rotate(3deg)"
          }
        },
        "flip-x": {
          "0%": { 
            transform: "perspective(400px) rotateX(0)"
          },
          "100%": { 
            transform: "perspective(400px) rotateX(360deg)"
          }
        },
        "border-flow": {
          "0%, 100%": {
            backgroundPosition: "0% 50%"
          },
          "50%": {
            backgroundPosition: "100% 50%"
          }
        },
        "color-cycle": {
          "0%": { 
            filter: "hue-rotate(0deg) saturate(1)"
          },
          "50%": { 
            filter: "hue-rotate(180deg) saturate(1.5)"
          },
          "100%": { 
            filter: "hue-rotate(360deg) saturate(1)"
          }
        },
        "bg-pan": {
          "0%": { 
            backgroundPosition: "0% center" 
          },
          "100%": { 
            backgroundPosition: "200% center" 
          }
        },
        "scale-pulse": {
          "0%, 100%": { 
            transform: "scale(1)" 
          },
          "50%": { 
            transform: "scale(1.05)" 
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "gradient-shift": "gradient-shift 8s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ripple": "ripple 1.5s cubic-bezier(0, 0.5, 0.5, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s ease infinite",
        "glow": "glow 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 8s linear infinite",
        "wiggle": "wiggle 2s ease-in-out infinite",
        "flip": "flip-x 4s ease-in-out infinite",
        "border-flow": "border-flow 4s ease infinite",
        "color-cycle": "color-cycle 10s infinite linear",
        "bg-pan": "bg-pan 8s linear infinite",
        "scale-pulse": "scale-pulse 3s ease-in-out infinite"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "luxury-gradient": "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold)))",
        "magic-pattern": "linear-gradient(135deg, hsl(var(--primary)/0.1) 25%, transparent 25%, transparent 50%, hsl(var(--primary)/0.1) 50%, hsl(var(--primary)/0.1) 75%, transparent 75%, transparent)",
        "shimmer-gradient": "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
        "rainbow-gradient": "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--gold)), hsl(var(--secondary)), hsl(var(--primary)))"
      },
    

    },
  },
  plugins: [import("tailwindcss-animate")],
};