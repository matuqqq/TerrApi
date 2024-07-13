using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

class Program
{
    public class Item
    {
        public string id { get; set; }
        public string name { get; set; }
        public string alternate_name { get; set; }
    }

    static void Main()
    {
        Console.WriteLine("Ingrese la ruta del archivo JSON:");
        string filePath = Console.ReadLine();

        if (File.Exists(filePath))
        {
            Console.WriteLine("Ingrese la ruta del directorio donde desea guardar los archivos JSON:");
            string outputDirectory = Console.ReadLine();

            if (!Directory.Exists(outputDirectory))
            {
                Console.WriteLine("El directorio no existe. ¿Desea crearlo? (s/n)");
                string createDirectory = Console.ReadLine();
                if (createDirectory.ToLower() == "s")
                {
                    Directory.CreateDirectory(outputDirectory);
                }
                else
                {
                    Console.WriteLine("Operación cancelada.");
                    return;
                }
            }

            try
            {
                // Leer el contenido del archivo JSON
                string json = File.ReadAllText(filePath);

                // Deserializar la cadena JSON en una lista de objetos Item
                List<Item> items = JsonConvert.DeserializeObject<List<Item>>(json);

                // Crear un archivo JSON para cada elemento en el directorio especificado
                foreach (var item in items)
                {
                    string itemJson = JsonConvert.SerializeObject(item, Formatting.Indented);
                    string outputFilePath = Path.Combine(outputDirectory, $"{item.id}.json");
                    File.WriteAllText(outputFilePath, itemJson);
                }

                Console.WriteLine("Archivos JSON creados exitosamente en el directorio especificado.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar el archivo JSON: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine("La ruta del archivo no existe.");
        }
    }
}
