// [START snippet]

package function;

import common.Order;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.nitric.api.NotFoundException;
import io.nitric.api.document.Documents;
import io.nitric.faas.Faas;

public class Read {

    public static void main(String[] args) {
        new Faas()
            .http(context -> {
                var paths = context.getRequest().getPath().split("/");
                var id = paths[paths.length - 1];
        
                try {
                    var order = new Documents().collection("orders")
                        .doc(id, Order.class)
                        .get();

                    var json = new ObjectMapper()
                        .writerWithDefaultPrettyPrinter()
                        .writeValueAsString(order);
        
                    context.getResponse()
                        .contentType("application/json")
                        .text(json);
                
                } catch (NotFoundException nfe) {
                    context.getResponse()
                        .status(404)
                        .text("Document not found: %s", id);
                        
                } catch (IOException ioe) {
                    context.getResponse()
                        .status(500)
                        .text("Error querying orders: %s", ioe);
                }
        
                return context;
            })
            .start();
    }
}

// [END snippet]