import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md bg-background p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welkom</h1>
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: '#34C759',
                color: 'white',
                borderRadius: '6px',
                padding: '10px',
                height: '40px',
                fontSize: '14px',
                fontWeight: '500',
              },
              input: {
                borderRadius: '6px',
                padding: '10px',
                height: '40px',
                fontSize: '14px',
              },
              label: {
                fontSize: '14px',
                color: 'inherit',
              },
            },
            className: {
              button: "w-full hover:bg-primary/90 transition-colors",
              input: "bg-background text-foreground",
              label: "text-foreground",
              message: "text-foreground",
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "E-mailadres",
                password_label: "Wachtwoord",
                email_input_placeholder: "Vul je e-mailadres in",
                password_input_placeholder: "Vul je wachtwoord in",
                button_label: "Inloggen",
                loading_button_label: "Inloggen...",
                social_provider_text: "Inloggen met {{provider}}",
                link_text: "Heb je al een account? Log in",
              },
              sign_up: {
                email_label: "E-mailadres",
                password_label: "Wachtwoord",
                email_input_placeholder: "Vul je e-mailadres in",
                password_input_placeholder: "Kies een wachtwoord",
                button_label: "Registreren",
                loading_button_label: "Registreren...",
                social_provider_text: "Registreren met {{provider}}",
                link_text: "Nog geen account? Registreer je",
                confirmation_text: "Controleer je e-mail voor de bevestigingslink",
              },
              forgotten_password: {
                link_text: "Wachtwoord vergeten?",
                email_label: "E-mailadres",
                password_label: "Wachtwoord",
                email_input_placeholder: "Vul je e-mailadres in",
                button_label: "Stuur herstel instructies",
                loading_button_label: "Versturen...",
                confirmation_text: "Controleer je e-mail voor de herstel link",
              },
              update_password: {
                password_label: "Nieuw wachtwoord",
                password_input_placeholder: "Vul je nieuwe wachtwoord in",
                button_label: "Wachtwoord bijwerken",
                loading_button_label: "Wachtwoord bijwerken...",
                confirmation_text: "Je wachtwoord is bijgewerkt",
              },
            },
          }}
          providers={[]}
          redirectTo="https://9a03382d-eeeb-4287-9fe5-0195d08e0642.lovableproject.com/login"
        />
      </div>
    </div>
  );
};

export default Login;