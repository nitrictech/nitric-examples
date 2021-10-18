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
                        .data(json);
                
                } catch (NotFoundException nfe) {
                    context.getResponse()
                        .status(404)
                        .data("Document not found: " + id);
                        
                } catch (IOException ioe) {
                    context.getResponse()
                        .status(500)
                        .data("Error querying orders: " + ioe.toString());
                }
        
                return context;
            })
            .start();
    }
}