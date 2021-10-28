// [START snippet]

package function;

import io.nitric.api.NotFoundException;
import io.nitric.api.document.Documents;
import io.nitric.faas.Faas;

public class Delete {

    public static void main(String[] args) {
        new Faas()
            .http(context -> {
                var paths = context.getRequest().getPath().split("/");
                var id = paths[paths.length - 1];

                try {
                    new Documents().collection("examples")
                        .doc(id)
                        .delete();

                    context.getResponse()
                        .text("Removed example: %s", id);

                } catch (NotFoundException nfe) {
                    context.getResponse()
                        .status(404)
                        .text("Document not found: %s", id);
                }

                return context;
            })
            .start();
    }
}

// [END snippet]