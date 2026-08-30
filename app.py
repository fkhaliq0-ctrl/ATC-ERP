import customtkinter as ctk
from tkinter import filedialog, messagebox

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class AlliedTradingApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Main Window Setup
        self.title("Allied Trading Corporation - ERP Dashboard")
        self.geometry("900x600")
        self.minsize(800, 500)

        # Configure Grid System
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        # ---------------- SIDEBAR DASHBOARD ----------------
        self.sidebar_frame = ctk.CTkFrame(self, width=200, corner_radius=0)
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(4, weight=1)

        # Logo / Title in Sidebar
        self.logo_label = ctk.CTkLabel(
            self.sidebar_frame, 
            text="ALLIED TRADING\nCORPORATION", 
            font=ctk.CTkFont(size=16, weight="bold")
        )
        self.logo_label.grid(row=0, column=0, padx=20, pady=(20, 30))

        # Sidebar Navigation Buttons
        self.btn_login = ctk.CTkButton(
            self.sidebar_frame, text="🔒 Login Portal", command=self.show_login_view
        )
        self.btn_login.grid(row=1, column=0, padx=20, pady=10)

        self.btn_dashboard = ctk.CTkButton(
            self.sidebar_frame, text="📊 Main Dashboard", command=self.show_dashboard_view, state="disabled"
        )
        self.btn_dashboard.grid(row=2, column=0, padx=20, pady=10)

        self.btn_settings = ctk.CTkButton(
            self.sidebar_frame, text="⚙️ Settings", command=self.show_settings_view, state="disabled"
        )
        self.btn_settings.grid(row=3, column=0, padx=20, pady=10)

        # App Status at Bottom of Sidebar
        self.status_label = ctk.CTkLabel(
            self.sidebar_frame, text="Status: Logged Out", font=ctk.CTkFont(size=11), text_color="gray"
        )
        self.status_label.grid(row=5, column=0, padx=20, pady=20)

        # ---------------- MAIN CONTENT AREA ----------------
        self.content_frame = ctk.CTkFrame(self, corner_radius=10)
        self.content_frame.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")

        # Variables
        self.selected_drive_path = ctk.StringVar(value="No external path selected")

        # Load initial screen (Login)
        self.show_login_view()

    # ---------------- VIEWS & SCREENS ----------------
    def clear_content_frame(self):
        for widget in self.content_frame.winfo_children():
            widget.destroy()

    def show_login_view(self):
        self.clear_content_frame()

        login_box = ctk.CTkFrame(self.content_frame, corner_radius=15)
        login_box.pack(padx=40, pady=40, expand=True)

        ctk.CTkLabel(
            login_box, text="System Login", font=ctk.CTkFont(size=20, weight="bold")
        ).pack(pady=(20, 10))

        self.username_entry = ctk.CTkEntry(login_box, placeholder_text="Username", width=250)
        self.username_entry.pack(pady=10)

        self.password_entry = ctk.CTkEntry(login_box, placeholder_text="Password", show="*", width=250)
        self.password_entry.pack(pady=10)

        ctk.CTkButton(
            login_box, text="📁 Select External Drive Folder", command=self.select_external_folder, fg_color="#333333"
        ).pack(pady=(10, 5))

        ctk.CTkLabel(
            login_box, textvariable=self.selected_drive_path, font=ctk.CTkFont(size=10), text_color="gray", wraplength=220
        ).pack(pady=(0, 15))

        ctk.CTkButton(
            login_box, text="Login to Dashboard", command=self.handle_login, width=250, font=ctk.CTkFont(weight="bold")
        ).pack(pady=(10, 20))

    def show_dashboard_view(self):
        self.clear_content_frame()

        ctk.CTkLabel(
            self.content_frame, text="Welcome to Allied Trading Dashboard", font=ctk.CTkFont(size=22, weight="bold")
        ).pack(pady=20)

        info_card = ctk.CTkFrame(self.content_frame)
        info_card.pack(fill="x", padx=20, pady=10)

        ctk.CTkLabel(info_card, text="Storage Drive Connected:", font=ctk.CTkFont(weight="bold")).pack(anchor="w", padx=15, pady=(10, 2))
        ctk.CTkLabel(info_card, text=self.selected_drive_path.get(), text_color="gray").pack(anchor="w", padx=15, pady=(0, 10))

    def show_settings_view(self):
        self.clear_content_frame()
        ctk.CTkLabel(self.content_frame, text="System Settings", font=ctk.CTkFont(size=20, weight="bold")).pack(pady=20)

    # ---------------- LOGIC HANDLERS ----------------
    def select_external_folder(self):
        folder = filedialog.askdirectory(title="Select External Storage Folder")
        if folder:
            self.selected_drive_path.set(folder)

    def handle_login(self):
        user = self.username_entry.get()
        pwd = self.password_entry.get()
        drive = self.selected_drive_path.get()

        if not user or not pwd:
            messagebox.showwarning("Input Error", "Please enter Username and Password.")
            return

        if drive == "No external path selected":
            messagebox.showwarning("Drive Required", "Please select your External Storage Folder.")
            return

        # Enable sidebar dashboard buttons upon successful login
        self.btn_dashboard.configure(state="normal")
        self.btn_settings.configure(state="normal")
        self.status_label.configure(text=f"Logged in: {user}", text_color="green")

        # Jump directly into the dashboard view
        self.show_dashboard_view()

if __name__ == "__main__":
    app = AlliedTradingApp()
    app.mainloop()
