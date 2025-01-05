function(instance, properties, context) {

    // Fonction pour configurer les gestionnaires d'événements de souris
    const configureMouseEvents = function() {
        let element = document.getElementById(properties.id);

        // Si l'élément n'existe pas, arrêter la configuration
        if (!element) return;

        // Fonction pour déclencher les événements personnalisés
        let triggerEvent = function(eventName) {
            instance.triggerEvent(eventName);
        };

        // Gestionnaire pour l'événement `mouseout`
        element.onmouseout = function(event) {
            triggerEvent("stops_being_hovered");
            instance.publishState("hovered", false);
        };

        // Gestionnaire pour l'événement `mouseover`
        element.onmouseover = function(event) {
            triggerEvent("is_hovered");
            instance.publishState("hovered", true);
        };

        // Fonction de nettoyage des gestionnaires d'événements
        instance.data.cleanup = () => {
            element.onmouseout = null;
            element.onmouseover = null;
        };
    };

    // Utilisation de MutationObserver pour détecter l'ajout de l'élément au DOM
    const observer = new MutationObserver((mutations, observerInstance) => {
        if (document.getElementById(properties.id)) {
            configureMouseEvents();
            observerInstance.disconnect();
        }
    });

    // Observer les changements dans le DOM
    observer.observe(document, { childList: true, subtree: true });

    // Initialiser la fonction de nettoyage
    instance.data.cleanup = instance.data.cleanup || function() {};

    // Fonction de destruction de l'instance pour le nettoyage
    instance.destroy = function() {
        if (instance.data.cleanup) {
            instance.data.cleanup();
        }
    };
}
