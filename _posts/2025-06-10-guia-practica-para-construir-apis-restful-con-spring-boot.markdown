---
layout: post
title: "🚀 Guía práctica para construir APIs RESTful con Spring Boot"
date: 2025-06-10
categories:
- java
- springboot
tags:
- Java
- Spring Boot
- REST API
image:
  path: /assets/images/posts/2025/spring-boot.jpeg
  alt: "Spring Boot"
---

## Introducción 🌱

Spring Boot se ha convertido en uno de los frameworks más populares para desarrollar aplicaciones Java modernas. Su enfoque centrado en la simplicidad y la configuración mínima lo hace ideal para construir APIs REST de forma rápida y robusta. En esta guía te mostraré cómo manejar rutas, controlar peticiones y respuestas, y estructurar tu aplicación siguiendo buenas prácticas. ¡Comencemos! 💪

## ¿Qué es **Spring Boot**?

Es una extensión **opinada** de Spring que:

  * Simplifica la configuración eliminando el “boilerplate”.
  * Incluye **starters**: dependencias que ya agregan todo lo necesario (ej.: *spring-boot-starter-web*, *spring-boot-starter-data-jpa*, etc.)
  * Incorpora un servidor embebido (Tomcat, Jetty...) para ejecutar aplicaciones como jar ejecutables
  * Ofrece **autoconfiguración** que detecta lo que tienes en el classpath y activa automáticamente lo pertinente
  * Trae características “lista para producción”: Actuator (métricas, health checks), configuración externa, logging integrado

## 🏷️ ¿Qué son las anotaciones en Spring?

Las **anotaciones** en Java (y en Spring) son **marcas especiales** que comienzan con `@` y se colocan sobre clases, métodos o atributos para darle instrucciones al framework sobre cómo debe comportarse ese elemento.

👉 En el contexto de **Spring**, las anotaciones reemplazan mucha configuración manual (como XML) y hacen el código más limpio y fácil de mantener.


## 🔧 Ejemplos comunes de anotaciones en Spring Boot

| Anotación                | ¿Para qué sirve?                                                     |
| ------------------------ | -------------------------------------------------------------------- |
| `@SpringBootApplication` | Marca el punto de entrada principal de una app Spring Boot           |
| `@Component`             | Indica que una clase es un componente administrado por Spring        |
| `@Service`               | Similar a `@Component`, pero semánticamente indica lógica de negocio |
| `@Repository`            | Marca una clase que accede a la base de datos                        |
| `@Controller`            | Define una clase que maneja peticiones HTTP                          |
| `@Autowired`             | Inyecta automáticamente dependencias                                 |


## 📦 ¿Cómo se importan?

En la mayoría de los entornos de desarrollo como IntelliJ IDEA o Eclipse, cuando escribes una anotación, el IDE suele sugerir automáticamente el **import** correcto.

Pero también puedes importarlas manualmente:

```java
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
```

💡 Estas anotaciones provienen de distintos paquetes dentro de Spring. Por ejemplo:

* `@Component`, `@Service`, `@Repository`: vienen de `org.springframework.stereotype`
* `@Autowired`: viene de `org.springframework.beans.factory.annotation`
* `@SpringBootApplication`: viene de `org.springframework.boot.autoconfigure`

## 🌐 Anotaciones para controladores REST en Spring

Estas anotaciones permiten mapear solicitudes HTTP (como GET, POST, PUT, etc.) a métodos específicos dentro de tus controladores.

| Anotación        | Uso principal                                                | Paquete                                                 |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| `@GetMapping`    | Maneja solicitudes **GET**                                   | `org.springframework.web.bind.annotation.GetMapping`    |
| `@PostMapping`   | Maneja solicitudes **POST**                                  | `org.springframework.web.bind.annotation.PostMapping`   |
| `@PutMapping`    | Maneja solicitudes **PUT** (actualizaciones completas)       | `org.springframework.web.bind.annotation.PutMapping`    |
| `@PatchMapping`  | Maneja solicitudes **PATCH** (actualizaciones parciales)     | `org.springframework.web.bind.annotation.PatchMapping`  |
| `@DeleteMapping` | Maneja solicitudes **DELETE**                                | `org.springframework.web.bind.annotation.DeleteMapping` |
| `@PathVariable`  | Extrae datos directamente de la **ruta URL**                 | `org.springframework.web.bind.annotation.PathVariable`  |
| `@RequestBody`   | Indica que un parámetro del método viene del **cuerpo HTTP** | `org.springframework.web.bind.annotation.RequestBody`   |

## 📦 Importación típica en un controlador REST

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
```

ó

```java
import org.springframework.web.bind.annotation.*;
```

💡 Todas estas anotaciones pertenecen al **paquete `org.springframework.web.bind.annotation`**, el cual es esencial para construir controladores REST con Spring MVC o Spring Boot.

## 📍 Mapeo de rutas HTTP con anotaciones REST

Spring Boot ofrece anotaciones específicas para cada tipo de verbo HTTP, facilitando la creación de rutas en tus controladores:

| Verbo HTTP | Anotación        | Uso común                    |
|------------|------------------|------------------------------|
| GET        | `@GetMapping`    | Obtener recursos             |
| POST       | `@PostMapping`   | Crear nuevos recursos        |
| PUT        | `@PutMapping`    | Reemplazar recursos          |
| DELETE     | `@DeleteMapping` | Eliminar recursos            |
| PATCH      | `@PatchMapping`  | Actualización parcial        |


## Ejemplo completo: CRUD de tareas 🗂️

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET: obtener una tarea
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
            .map(task -> new ResponseEntity<>(task, HttpStatus.OK))
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // POST: crear una tarea
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task created = taskService.saveTask(task);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT: actualizar una tarea completamente
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        return new ResponseEntity<>(taskService.updateTask(id, task), HttpStatus.OK);
    }

    // PATCH: actualizar parcialmente una tarea
    @PatchMapping("/{id}")
    public ResponseEntity<Task> patchTask(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return new ResponseEntity<>(taskService.patchTask(id, updates), HttpStatus.OK);
    }

    // DELETE: eliminar una tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
```

## 🔍 Parámetros dinámicos y consultas personalizadas

Ya sea extrayendo valores de la URL con `@PathVariable` o leyendo parámetros de consulta con `@RequestParam`, Spring Boot te da herramientas claras para manejar solicitudes complejas.

### Ejemplo con parámetros de búsqueda:

```java
@GetMapping("/search")
public ResponseEntity<List<Task>> searchTasks(
    @RequestParam String title,
    @RequestParam(required = false) Boolean completed
) {
    List<Task> tasks = taskService.findByTitleAndStatus(title, completed);
    return new ResponseEntity<>(tasks, HttpStatus.OK);
}
```

## 🧱 Separación por capas: arquitectura limpia en Spring Boot

Para un desarrollo escalable, aplica una arquitectura multicapa:

- **Controller**: entrada de peticiones HTTP.
- **Service**: lógica de negocio.
- **Repository**: acceso a base de datos.
- **DTO/Model**: transporte de datos y mapeo a entidades.

```bash
com.example.app
├── controller
├── service
├── repository
├── dto
└── model
```

## 💾 Persistencia con JPA + Hibernate

Spring Boot configura automáticamente JPA (usualmente con Hibernate) para que puedas mapear objetos Java a tablas SQL fácilmente:

```java
@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private boolean completed;
}
```

Y para configurar la base de datos, basta con esto en `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskdb
spring.datasource.username=root
spring.datasource.password=tu_clave
spring.jpa.hibernate.ddl-auto=update
```

## 📦 Uso de DTOs para separar entidades y transporte de datos

Un **DTO (Data Transfer Object)** es una clase que se utiliza para transportar datos entre el cliente y el servidor, sin exponer directamente las entidades del dominio.

### Ventajas de usar DTOs

- 🔒 Ocultas campos sensibles o irrelevantes de la entidad.
- 🧩 Puedes personalizar qué datos enviar o recibir según el caso de uso.
- 🔄 Desacoplas la lógica de persistencia del formato de comunicación.

### Ejemplo de DTO para crear tareas:

```java
public class TaskCreateDTO {
    private String title;
    private boolean completed;

    // Getters y setters
}
```

Y para la respuesta:

```java
public class TaskDTO {
    private Long id;
    private String title;
    private boolean completed;

    public static TaskDTO fromEntity(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setCompleted(task.isCompleted());
        return dto;
    }
}
```

## 🧪 Inyección de dependencias en Spring Boot

La **inyección de dependencias (DI)** permite a Spring proporcionar automáticamente los objetos que una clase necesita, sin que ella los cree manualmente.

### Ventajas:

- 🔄 Menor acoplamiento entre clases.
- 🧪 Facilita las pruebas unitarias.
- ♻️ Mayor reutilización y mantenibilidad del código.

### Ejemplo:

```java
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired // Constructor recomendado
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }
}
```

## 🗃️ Acceso a datos con Repository

La anotación `@Repository` marca una interfaz como componente que accede a la base de datos. Usando `JpaRepository`, heredas métodos CRUD listos para usar.

```java
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCompleted(boolean completed);
}
```

## 🔗 Llevando todo a la práctica: POST con DTO + DI + Repository

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskCreateDTO taskDto) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setCompleted(taskDto.isCompleted());

        Task saved = taskService.saveTask(task);
        return new ResponseEntity<>(TaskDTO.fromEntity(saved), HttpStatus.CREATED);
    }
}
```

### Ventajas de esta implementación

- ✅ **DTO** protege tu modelo interno y simplifica la comunicación con el cliente.
- ✅ **Inyección de dependencias** facilita pruebas y mantiene tu código limpio.
- ✅ **Repository** centraliza el acceso a la base de datos, usando interfaces concisas.


## 📦 Despliegue con Docker 🐳

Ejemplo de Dockerfile para construir tú imagen:

```Dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

Ejemplo de configuración de Docker Compose:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - '8080:8080'
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/taskdb
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=taskdb
```


## 🧠 Conclusión

Spring Boot es una herramienta poderosa para desarrollar APIs REST modernas y bien estructuradas. Gracias a su conjunto de anotaciones como `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` y `@PatchMapping`, puedes construir endpoints eficientes de manera declarativa y clara 🧩. Al combinarlo con una arquitectura por capas, patrones como DTO y prácticas como el despliegue con Docker, obtienes una solución completa y lista para producción 🚀.

¿Estás listo para construir tu próxima API con Spring Boot? ¡Manos a la obra! 💻🔥


## 🌐 Recursos web oficiales para profundizar

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Guía Quickstart](https://spring.io/quickstart)
- [Construyendo una aplicación con Spring Boot](https://spring.io/guides/gs/spring-boot)
- [Construyendo servicios web RESTful](https://spring.io/guides/gs/rest-service)
- [Guías](https://spring.io/guides)