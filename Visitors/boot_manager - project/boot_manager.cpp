#include <gtk/gtk.h>
#include <string>
#include <vector>
#include <memory>
#include <cstdio>
#include <cstdlib>
#include <array>

// Global variables
GtkWidget *boot_listbox;
GtkWidget *status_label;

std::string exec_command(const char* cmd) {
    std::string result;
    std::array<char, 128> buffer;
    std::shared_ptr<FILE> pipe(popen(cmd, "r"), pclose);
    if (!pipe) return "ERROR";
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
        result += buffer.data();
    }
    return result;
}

void set_status(const char *msg) {
    gtk_label_set_text(GTK_LABEL(status_label), msg);
}

void clear_boot_list() {
    GtkWidget *child = gtk_widget_get_first_child(GTK_WIDGET(boot_listbox));
    while (child != nullptr) {
        GtkWidget *next = gtk_widget_get_next_sibling(child);
        gtk_list_box_remove(GTK_LIST_BOX(boot_listbox), child);
        child = next;
    }
}

void load_boot_entries(GtkButton *button, gpointer user_data) {
    (void)button;
    (void)user_data;

#ifdef _WIN32
    set_status("Boot entry management is not supported on Windows.");
    clear_boot_list();
#else
    set_status("Loading boot entries...");
    clear_boot_list();

    std::string output = exec_command("efibootmgr");
    if (output == "ERROR") {
        set_status("Failed to execute efibootmgr.");
        return;
    }

    size_t pos = 0;
    int count = 0;
    while (true) {
        size_t next = output.find('\n', pos);
        std::string line = output.substr(pos, next - pos);
        pos = (next == std::string::npos) ? next : next + 1;

        if (line.rfind("Boot", 0) == 0) {
            GtkWidget *row = gtk_list_box_row_new();
            GtkWidget *box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 6);
            GtkWidget *check = gtk_check_button_new();
            GtkWidget *label = gtk_label_new(line.c_str());

            gtk_label_set_xalign(GTK_LABEL(label), 0);
            gtk_box_append(GTK_BOX(box), check);
            gtk_box_append(GTK_BOX(box), label);

            gtk_list_box_row_set_child(GTK_LIST_BOX_ROW(row), box);
            gtk_list_box_append(GTK_LIST_BOX(boot_listbox), row);

            count++;
        }

        if (next == std::string::npos) break;
    }

    set_status(count == 0 ? "No boot entries found." : "Boot entries loaded.");
#endif
}

void delete_selected_entries(GtkButton *button, gpointer window) {
    (void)button;
    (void)window;

#ifdef _WIN32
    set_status("Deleting boot entries is not supported on Windows.");
#else
    GListModel *model = gtk_list_box_get_model(GTK_LIST_BOX(boot_listbox));
    std::vector<std::string> to_delete;

    for (guint i = 0; i < g_list_model_get_n_items(model); ++i) {
        GtkWidget *row = GTK_WIDGET(g_list_model_get_item(model, i));
        GtkWidget *box = gtk_list_box_row_get_child(GTK_LIST_BOX_ROW(row));
        GList *children = gtk_container_get_children(GTK_CONTAINER(box));

        GtkWidget *check = GTK_WIDGET(g_list_nth_data(children, 0));
        GtkWidget *label = GTK_WIDGET(g_list_nth_data(children, 1));
        g_list_free(children);

        if (gtk_check_button_get_active(GTK_CHECK_BUTTON(check))) {
            const char *text = gtk_label_get_text(GTK_LABEL(label));
            if (text && strlen(text) >= 8) {
                to_delete.push_back(std::string(text).substr(4, 4));
            }
        }

        g_object_unref(row);
    }

    if (to_delete.empty()) {
        set_status("No boot entries selected.");
        return;
    }

    GtkWidget *dialog = gtk_message_dialog_new(GTK_WINDOW(window),
        GTK_DIALOG_MODAL,
        GTK_MESSAGE_QUESTION,
        GTK_BUTTONS_OK_CANCEL,
        "Delete selected boot entries?");
    gint response = gtk_dialog_run(GTK_DIALOG(dialog));
    gtk_window_destroy(GTK_WINDOW(dialog));

    if (response != GTK_RESPONSE_OK) {
        set_status("Deletion cancelled.");
        return;
    }

    int deleted = 0;
    for (const std::string &id : to_delete) {
        std::string cmd = "sudo efibootmgr -b " + id + " -B";
        if (system(cmd.c_str()) == 0)
            deleted++;
    }

    set_status((std::to_string(deleted) + " boot entries deleted.").c_str());
    load_boot_entries(nullptr, nullptr);
#endif
}

void update_grub(GtkButton *button, gpointer user_data) {
    (void)button;
    (void)user_data;

#ifdef _WIN32
    set_status("GRUB update not supported on Windows.");
#else
    set_status("Updating GRUB...");
    int ret = system("sudo update-grub");
    if (ret != 0) {
        ret = system("sudo grub-mkconfig -o /boot/grub/grub.cfg");
    }
    set_status(ret == 0 ? "GRUB updated." : "Failed to update GRUB.");
#endif
}

void restore_windows_bootloader(GtkButton *button, gpointer user_data) {
    (void)button;
    (void)user_data;

#ifdef _WIN32
    set_status("Restoring Windows bootloader...");
    const char *commands[] = {
        "bcdedit /set {bootmgr} path \\EFI\\Microsoft\\Boot\\bootmgfw.efi",
        "bootrec /fixmbr",
        "bootrec /fixboot",
        "bootrec /rebuildbcd"
    };

    bool success = true;
    for (const char *cmd : commands) {
        if (system(cmd) != 0) {
            success = false;
            break;
        }
    }

    set_status(success ? "Windows bootloader restored." : "Failed to restore Windows bootloader.");
#else
    set_status("Windows bootloader restoration only supported on Windows.");
#endif
}

static void activate(GtkApplication *app, gpointer user_data) {
    (void)user_data;

    GtkWidget *window = gtk_application_window_new(app);
    gtk_window_set_title(GTK_WINDOW(window), "Bootloader Manager");
    gtk_window_set_default_size(GTK_WINDOW(window), 600, 400);

    GtkWidget *vbox = gtk_box_new(GTK_ORIENTATION_VERTICAL, 6);
    gtk_window_set_child(GTK_WINDOW(window), vbox);

    boot_listbox = gtk_list_box_new();
    gtk_list_box_set_selection_mode(GTK_LIST_BOX(boot_listbox), GTK_SELECTION_NONE);
    gtk_box_append(GTK_BOX(vbox), boot_listbox);

    GtkWidget *button_box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 6);
    gtk_box_append(GTK_BOX(vbox), button_box);

    GtkWidget *refresh_btn = gtk_button_new_with_label("Refresh");
    GtkWidget *delete_btn = gtk_button_new_with_label("Delete");
    GtkWidget *update_btn = gtk_button_new_with_label("Update GRUB");
    GtkWidget *restore_btn = gtk_button_new_with_label("Restore Windows Bootloader");

    gtk_box_append(GTK_BOX(button_box), refresh_btn);
    gtk_box_append(GTK_BOX(button_box), delete_btn);
    gtk_box_append(GTK_BOX(button_box), update_btn);
    gtk_box_append(GTK_BOX(button_box), restore_btn);

    g_signal_connect(refresh_btn, "clicked", G_CALLBACK(load_boot_entries), window);
    g_signal_connect(delete_btn, "clicked", G_CALLBACK(delete_selected_entries), window);
    g_signal_connect(update_btn, "clicked", G_CALLBACK(update_grub), window);
    g_signal_connect(restore_btn, "clicked", G_CALLBACK(restore_windows_bootloader), window);

    status_label = gtk_label_new("Ready.");
    gtk_widget_set_halign(status_label, GTK_ALIGN_START);
    gtk_box_append(GTK_BOX(vbox), status_label);

    gtk_window_present(GTK_WINDOW(window));

    load_boot_entries(nullptr, nullptr);
}

void ignore_gio_warnings(const gchar *log_domain,
                         GLogLevelFlags log_level,
                         const gchar *message,
                         gpointer user_data) {
    // Ignorer advarselen – gjør ingenting
}

int main(int argc, char **argv) {
    g_log_set_handler("GLib-GIO", G_LOG_LEVEL_WARNING, (GLogFunc)ignore_gio_warnings, NULL);

    GtkApplication *app = gtk_application_new("com.example.bootman", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    g_object_unref(app);
    return status;