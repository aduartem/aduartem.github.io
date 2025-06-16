---
layout: post
title: "🚀 Guía práctica para construir APIs RESTful con Spring Boot"
date: 2025-06-10
last_modified_at: 2025-06-16
categories:
- java
- spring-boot
tags:
- Java
- Spring Boot
- REST API
image:
  path: /assets/images/posts/2025/07f58bb1-cb8e-4869-b0b9-10bca603ebc9.jpg
  alt: "Spring Boot"
---

> **Actualización [16/06/2025]**: Este artículo ha sido actualizado para incluir una sección avanzada sobre mejores prácticas con DTOs y separación de responsabilidades, junto con una conclusión más detallada sobre los beneficios de esta arquitectura.


Spring Boot se ha convertido en uno de los frameworks más populares para desarrollar aplicaciones Java modernas. Su enfoque centrado en la simplicidad y la configuración mínima lo hace ideal para construir APIs REST de forma rápida y robusta. En esta guía te mostraré cómo manejar rutas, controlar peticiones y respuestas, y estructurar tu aplicación siguiendo buenas prácticas. ¡Comencemos!

## 🌱 ¿Qué es **Spring Boot**?

Es una extensión **opinada** de Spring que:

  * Simplifica la configuración eliminando el "boilerplate".
  * Incluye **starters**: dependencias que ya agregan todo lo necesario (ej.: *spring-boot-starter-web*, *spring-boot-starter-data-jpa*, etc.)
  * Incorpora un servidor embebido (Tomcat, Jetty...) para ejecutar aplicaciones como jar ejecutables
  * Ofrece **autoconfiguración** que detecta lo que tienes en el classpath y activa automáticamente lo pertinente
  * Trae características "lista para producción": Actuator (métricas, health checks), configuración externa, logging integrado

## 🏷️ ¿Qué son las anotaciones en Spring?

Las **anotaciones** en Java (y en Spring) son **marcas especiales** que comienzan con `@` y se colocan sobre clases, métodos o atributos para darle instrucciones al framework sobre cómo debe comportarse ese elemento.

En el contexto de **Spring**, las anotaciones reemplazan mucha configuración manual (como XML) y hacen el código más limpio y fácil de mantener.


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

Las anotaciones en los controladores REST de Spring Boot permiten definir de manera sencilla cómo se manejan las rutas y cómo se recibe la información del cliente. Esto hace que la creación de endpoints sea clara, flexible y fácil de mantener.

### Anotaciones para rutas según el verbo HTTP

| Verbo HTTP | Anotación        | Uso común                    |
|------------|------------------|------------------------------|
| GET        | `@GetMapping`    | Obtener recursos             |
| POST       | `@PostMapping`   | Crear nuevos recursos        |
| PUT        | `@PutMapping`    | Reemplazar recursos          |
| DELETE     | `@DeleteMapping` | Eliminar recursos            |
| PATCH      | `@PatchMapping`  | Actualización parcial        |

### Anotaciones para recibir datos del cliente

Estas anotaciones permiten a los controladores recibir información enviada por el cliente de distintas formas, facilitando la construcción de endpoints flexibles.

| Anotación        | Uso principal                                                |
| ---------------- | ------------------------------------------------------------ |
| `@PathVariable`  | Extrae datos directamente de la **ruta URL**                 |
| `@RequestBody`   | Indica que un parámetro del método viene del **cuerpo HTTP** |


`@PathVariable` se utiliza para capturar valores dinámicos que forman parte de la URL (por ejemplo, un identificador en `/api/tareas/123`), mientras que `@RequestBody` permite recibir y deserializar datos enviados en el cuerpo de la petición, como objetos JSON en operaciones POST o PUT.
Estas herramientas facilitan la construcción de endpoints flexibles y adaptados a diferentes necesidades de entrada de datos.

💡 Todas estas anotaciones pertenecen al **paquete `org.springframework.web.bind.annotation`**, el cual es esencial para construir controladores REST con Spring MVC o Spring Boot.

#### Importación

Podemos importar cada anotación de forma individual o usar el comodín para importar todas:

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
// o simplemente
import org.springframework.web.bind.annotation.*;
```


### Buenas prácticas

- Utiliza DTOs para separar la lógica de tu dominio del formato de entrada/salida.
- Valida los datos recibidos en el cuerpo de la petición usando anotaciones como `@Valid`.
- Mantén tus controladores enfocados solo en la lógica de manejo de peticiones.


### Error común

- No validar los datos recibidos, lo que puede provocar errores en tiempo de ejecución.

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


## 🔗 ¿Este ejemplo es posible mejorarlo aún más? Definitivamente Si! *(Nuevo: 16/06/2025)*

Este ejemplo podemos mejorar de la siguiente forma:

1. ```TaskCreateDTO.java```

```java
import jakarta.validation.constraints.NotBlank;

public class TaskCreateDTO {

    @NotBlank(message = "El título es obligatorio")
    private String title;

    private boolean completed;

    // Getters y setters
}
```

2. ```TaskDTO.java```

```java
public class TaskDTO {

    private Long id;
    private String title;
    private boolean completed;

    // Constructor
    public TaskDTO(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    public static TaskDTO fromEntity(Task task) {
        return new TaskDTO(task.getId(), task.getTitle(), task.isCompleted());
    }

    // Getters y setters (si usas Lombok puedes evitarlos)
}
```

3. ```TaskMapper.java```

```java
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(TaskCreateDTO dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setCompleted(dto.isCompleted());
        return task;
    }

    public TaskDTO toDto(Task task) {
        return new TaskDTO(task.getId(), task.getTitle(), task.isCompleted());
    }
}
```

4. ```TaskService.java```

```java
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    public TaskDTO saveTask(TaskCreateDTO dto) {
        Task task = taskMapper.toEntity(dto);
        Task saved = taskRepository.save(task);
        return taskMapper.toDto(saved);
    }
}
```

5. ```TaskController.java``` (refactorizado)

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody @Valid TaskCreateDTO taskDto) {
        TaskDTO saved = taskService.saveTask(taskDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
```

6. ```ControllerAdvice``` para manejar errores de validación (opcional pero recomendado)

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
```


### Beneficios del cambio

| Mejora                          | Justificación                                                                |
| ------------------------------- | ---------------------------------------------------------------------------- |
| Separación de responsabilidades | El controlador solo orquesta, no construye entidades.                        |
| Validación declarativa          | El DTO tiene validaciones con `@NotBlank`.                                   |
| Mapper dedicado                 | Se estandariza la transformación entre DTOs y entidades.                     |
| Más testable                    | Cada clase tiene una única responsabilidad, facilitando los tests unitarios. |


### ¿Por qué usar TaskDTO y TaskCreateDTO?

| Clase           | Uso                                       | Contenido típico                                                   |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| `TaskCreateDTO` | **Entrada (request)** para crear tareas   | Solo campos que el cliente puede enviar (ej: `title`, `completed`) |
| `TaskDTO`       | **Salida (response)** para mostrar tareas | Campos calculados o internos: `id`, `createdAt`, `updatedAt`, etc. |


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

Spring Boot es una herramienta poderosa para desarrollar APIs REST modernas y bien estructuradas. Gracias a su conjunto de anotaciones como `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` y `@PatchMapping`, puedes construir endpoints eficientes de manera declarativa y clara 🧩. Al combinarlo con una arquitectura por capas, patrones como DTO y prácticas como el despliegue con Docker, obtienes una solución completa y lista para producción 🚀. Los principales beneficios de los temas abordados en esta guía son:

### 🔧 1. Separación de responsabilidades (SRP)
- El controlador (TaskController) ya no construye entidades, solo orquesta el flujo.
- La lógica de negocio y persistencia se delega al TaskService.
- La transformación entre DTOs y entidades queda encapsulada en TaskMapper.

***Beneficio***: más limpio, más testable y cada clase hace solo lo que le corresponde.

### 📦 2. Uso de DTOs
- Se utilizaron TaskCreateDTO para entradas (POST) y TaskDTO para salidas (responses).
- Esto protege la entidad interna (Task) de exposiciones innecesarias y errores de seguridad.

***Beneficio***: puedes controlar qué campos expone o recibe la API, manteniendo coherencia y evitando sobreexposición de datos.

### 🧹 3. Validación declarativa
- Uso de anotaciones como @NotBlank, @Valid, y @ControllerAdvice para manejar errores de forma centralizada.

***Beneficio***: validaciones limpias, automáticas, y respuestas uniformes ante errores de entrada.

### 🧰 4. Inversión de dependencias y testabilidad
- TaskService y TaskMapper son fácilmente testeables y mockeables.
- El controlador es delgado y desacoplado, ideal para pruebas con MockMVC o RestAssured.

***Beneficio***: código listo para escalar y con bajo acoplamiento, ideal para equipos grandes o proyectos profesionales.

### ⚖️ ¿Vale la pena todo este esfuerzo?
Sí, si tu proyecto:
- Tiene múltiples endpoints y va a escalar.
- Involucra equipos de desarrollo.
- Necesita testeo automatizado.
- Requiere exponer solo ciertos campos y proteger la lógica de negocio.

En un proyecto simple o prototipo, puedes reducir el overhead, pero en un entorno profesional, esta arquitectura **es altamente recomendable**.


**Nota:** Próximamente publicaré una serie de post donde profundizaré más sobre los temas abordados acá.


## 🌐 Recursos web oficiales para profundizar

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Guía Quickstart](https://spring.io/quickstart)
- [Construyendo una aplicación con Spring Boot](https://spring.io/guides/gs/spring-boot)
- [Construyendo servicios web RESTful](https://spring.io/guides/gs/rest-service)
- [Guías](https://spring.io/guides)


## Historial de actualizaciones

- **16/06/2025**: Añadida sección sobre implementación avanzada con DTOs, mappers, y validación. Ampliada la conclusión para destacar los beneficios de esta arquitectura.
- **10/06/2025**: Publicación original