package function;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import common.Order;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.nitric.api.document.Documents;
import io.nitric.faas.Faas;

public class Create {

    public static void main(String[] args) {
        new Faas()
            .http(context -> {
                try {
                    var json = context.getRequest().getDataAsText();
                    var order = new ObjectMapper().readValue(json, Order.class);

                    order.id = UUID.randomUUID().toString();
                    order.dateOrdered = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        
                    new Documents().collection("orders").doc(order.id, Order.class).set(order);
        
                    var msg = String.format("Created order with ID: %s", order.id);
                    context.getResponse().data(msg);
        
                } catch (IOException ioe) {
                    context.getResponse()
                        .status(500)
                        .data("error: " + ioe);
                }
        
                return context;
            })
            .start();
    }

}