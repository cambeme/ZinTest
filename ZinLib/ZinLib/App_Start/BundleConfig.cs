using System.Web;
using System.Web.Optimization;

namespace ZinLib
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/css/layout").Include(
                        "~/Assets/css/layout.css"));

            bundles.Add(new StyleBundle("~/css/plugins").Include(
                        "~/Assets/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css",
                        "~/Assets/css/fonts-open-sans.css",
                        "~/Assets/plugins/font-awesome/css/font-awesome.min.css",
                        "~/Assets/plugins/jquery-loadingModal/css/jquery.loadingModal.css",
                        "~/Assets/plugins/bootstrap/css/bootstrap.min.css",
                        "~/Assets/plugins/bootstrap/css/bootstrap-theme.min.css",
                        "~/Assets/plugins/datatable/datatables.min.css",
                        "~/Assets/plugins/jquery-ui-themes-1.12.1/jquery-ui.min.css",
                        "~/Assets/plugins/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.min.css",
                        "~/Assets/plugins/select2/css/select2.min.css",
                        "~/Assets/plugins/lobibox/css/lobibox.min.css",
                        "~/Assets/plugins/jstree/themes/proton/style.min.css",
                        "~/Assets/plugins/SmartWizard/css/smart_wizard.css",
                        "~/Assets/plugins/SmartWizard/css/smart_wizard_theme_dots.css",
                        "~/Assets/plugins/tooltipster/css/tooltipster.bundle.min.css",
                        "~/Assets/plugins/tooltipster/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-shadow.min.css",
                        "~/Assets/plugins/json-viewer/jquery.json-viewer.css"
                    ));

            bundles.Add(new StyleBundle("~/css/custom").Include(
                        "~/Assets/css/custom.min.css"));

            bundles.Add(new ScriptBundle("~/js/layout").Include(
                        "~/Assets/js/layout.js"));

            bundles.Add(new ScriptBundle("~/js/plugins").Include(
                        "~/Assets/plugins/jquery/jquery-2.2.4.min.js",
                        "~/Assets/plugins/jquery-loadingModal/js/jquery.loadingModal.min.js",
                        "~/Assets/plugins/bootstrap/js/bootstrap.min.js",
                        "~/Assets/plugins/datatable/datatables.min.js",
                        "~/Assets/plugins/jquery-ui-themes-1.12.1/jquery-ui.min.js",
                        "~/Assets/plugins/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.min.js",
                        "~/Assets/plugins/jquery-ui-timepicker-addon/i18n/jquery-ui-timepicker-vi.js",
                        "~/Assets/plugins/select2/js/select2.full.min.js",
                        "~/Assets/plugins/select2/js/i18n/vi.js",
                        "~/Assets/plugins/lobibox/js/lobibox.min.js",
                        "~/Assets/plugins/jstree/jstree.min.js",
                        "~/Assets/plugins/SmartWizard/js/jquery.smartWizard.min.js",
                        "~/Assets/plugins/tooltipster/js/tooltipster.bundle.min.js",
                        "~/Assets/plugins/json-viewer/jquery.json-viewer.js",
                        "~/Assets/plugins/jquery-validation/jquery.validate.js",
                        "~/Assets/plugins/jquery-validation/additional-methods.js",
                        "~/Assets/plugins/jquery-validation/localization/messages_vi.js",
                        "~/Assets/plugins/Inputmask/jquery.inputmask.bundle.min.js",
                        "~/Assets/plugins/tinymce/tinymce.min.js",
                        "~/Assets/plugins/moment/moment-with-locales.min.js",
                        "~/Assets/plugins/lokijs/lokijs.min.js",
                        "~/Assets/plugins/lokijs/lokijs/loki-indexed-adapter.min.js",
                        "~/Assets/plugins/lokijs/loki-indexed-adapter.min.js"
                    ));

            bundles.Add(new StyleBundle("~/js/custom").Include(
                        "~/Assets/js/zinlib.js",
                        "~/Assets/js/custom.min.js"
                    ));

            BundleTable.EnableOptimizations = false;
        }
    }
}
