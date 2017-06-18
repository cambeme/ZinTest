using System.Web;
using System.Web.Optimization;
using System.Web.Optimization.React;

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
                        "~/Assets/plugins/jquery-loadingModal/css/jquery.loadingModal.css",
                        "~/Assets/plugins/bootstrap/css/bootstrap.min.css",
                        "~/Assets/plugins/bootstrap/css/bootstrap-theme.min.css",
                        "~/Assets/plugins/datatable/datatables.min.css",
                        "~/Assets/plugins/jquery-ui-themes-1.12.1/jquery-ui.min.css",
                        "~/Assets/plugins/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.min.css",
                        "~/Assets/plugins/select2/css/select2.min.css",
                        "~/Assets/plugins/lobibox/css/lobibox.min.css",
                        "~/Assets/plugins/jstree/themes/proton/style.min.css",
                        "~/Assets/plugins/SmartWizard/css/smart_wizard.min.css",
                        "~/Assets/plugins/SmartWizard/css/smart_wizard_theme_arrows.min.css",
                        "~/Assets/plugins/SmartWizard/css/smart_wizard_theme_circles.min.css",
                        "~/Assets/plugins/SmartWizard/css/smart_wizard_theme_dots.min.css",
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
                        //"~/Assets/plugins/jquery/jquery-3.2.1.min.js",
                        //"~/Assets/plugins/jquery/jquery-migrate-3.0.0.js",
                        "~/Assets/plugins/jquery.initialize/jquery.initialize.min.js",
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
                        "~/Assets/plugins/SmartWizard/js/jquery.smartWizard.js",
                        "~/Assets/plugins/tooltipster/js/tooltipster.bundle.min.js",
                        "~/Assets/plugins/json-viewer/jquery.json-viewer.js",

                        "~/Assets/plugins/reactjs/react.min.js",
                        "~/Assets/plugins/reactjs/react-dom.min.js",
                        "~/Assets/plugins/reactjs/babel.min.js",
                        "~/Assets/plugins/jquery-autocomplete/jquery.autocomplete.min.js",
                        "~/Assets/plugins/ResizeListener/ResizeListener.js",
                        "~/Assets/plugins/mammoth.js/mammoth.browser.min.js",
                        "~/Assets/plugins/jquery-validation/jquery.validate.js",
                        "~/Assets/plugins/jquery-validation/additional-methods.js",
                        "~/Assets/plugins/jquery-validation/localization/messages_vi.js",
                        "~/Assets/plugins/Inputmask/jquery.inputmask.bundle.min.js",
                        "~/Assets/plugins/jquery.pulsate/jquery.pulsate.min.js",
                        //"~/Assets/plugins/tinymce/tinymce.min.js",
                        "~/Assets/plugins/moment/moment-with-locales.min.js",
                        "~/Assets/plugins/lokijs/lokijs.js",
                        "~/Assets/plugins/lokijs/loki-indexed-adapter.min.js"
                        ));
            bundles.Add(new BabelBundle("~/reactjs/components").Include(
                        "~/Assets/js/components.jsx"
                        ));
            bundles.Add(new StyleBundle("~/js/custom").Include(
                         "~/Assets/js/zinlib.js"
                        ));

            BundleTable.EnableOptimizations = false;
        }
    }
}
