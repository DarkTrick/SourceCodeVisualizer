import queue

class MyQueue(queue.Queue):
  """
  Queue with extra features
  """
  def putList(self, iterable):
    """Adds each item of the list (`iteratble`) into the queue"""
    for item in iterable:
      self.put (item)
