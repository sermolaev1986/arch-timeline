package ru.arch_timeline.server;

import com.google.appengine.api.datastore.*;
import com.google.gson.*;

import javax.servlet.ServletException;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.Date;


public class TestServlet extends HttpServlet implements JsonSerializer<Entity> {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        DatastoreService service =  DatastoreServiceFactory.getDatastoreService();

        Query query = new Query("ArchEvent");

        PreparedQuery pq = service.prepare(query);

        resp.setContentType("text/plain");
        resp.setHeader("Cache-Control", "no-cache");

        Gson gson = new GsonBuilder().registerTypeAdapter(Entity.class, this).create();

        PrintWriter pw = resp.getWriter();
        pw.write (gson.toJson(pq.asList(FetchOptions.Builder.withDefaults()))) ;

        pw.flush();
        pw.close();

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        DatastoreService service =  DatastoreServiceFactory.getDatastoreService();
        Entity entity = new Entity("ArchEvent");
        entity.setProperty("eventDate", new Date());
        entity.setProperty("eventTitle", "myTitle");

        service.put(entity);
    }

    @Override
    public JsonElement serialize(Entity entity, Type type, JsonSerializationContext jsonSerializationContext) {

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");
        JsonObject jsonObject = new JsonObject();
        for (String name: entity.getProperties().keySet()) {
            Object property = entity.getProperty(name);
            String value;
            if (property instanceof Date)   {
                value = simpleDateFormat.format(property);
            } else  {
                value = property.toString();
            }

            jsonObject.addProperty(name, value);
        }

        return jsonObject;

    }
}
