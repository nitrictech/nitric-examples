package function;

import common.Order;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.nitric.api.document.Documents;
import io.nitric.api.document.ResultDoc;
import io.nitric.faas.Faas;

import java.io.IOException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class List {

    public static void main(String[] args) {
        new Faas()
            .http(context -> {
                Stream<ResultDoc<Order>> stream = new Documents().collection("orders")
                    .query(Order.class)
                    .stream();
        
                java.util.List<Order> orders = stream
                    .map(ResultDoc::getContent)
                    .collect(Collectors.toUnmodifiableList());

                try {
                    var json = new ObjectMapper()
                        .writerWithDefaultPrettyPrinter()
                        .writeValueAsString(orders);

                    context.getResponse()
                        .contentType("application/json")
                        .data(json);
        
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